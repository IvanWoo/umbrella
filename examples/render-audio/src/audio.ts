// SPDX-License-Identifier: Apache-2.0
import {
	AGen,
	adsr,
	biquadHP,
	biquadLP,
	filterFeedbackDelay,
	osc,
	pipe,
	product,
	saw,
	sin,
	svfLP,
	type ADSR,
	type IGen,
	type Osc,
	type SVF,
} from "@thi.ng/dsp";
import { clamp11 } from "@thi.ng/math";
import { XsAdd, pickRandom } from "@thi.ng/random";
import { repeatedly } from "@thi.ng/transducers";

interface SequencerOpts {
	bpm: number;
	noteLength: number;
	seed: number;
	probability: number;
	baseOctave: number;
	numOctaves: number;
}

// sample frequency/rate (in Hz)
export const FS = 44100;

// global PRNG for reproducible results
const RND = new XsAdd();

// compute frequency of C1, derived from A0 (27.5Hz = A4/(2^4) = 440/16)
// reference: https://newt.phys.unsw.edu.au/jw/notes.html
const C1 = 2 ** (3 / 12) * 27.5;

// Major scale (https://en.wikipedia.org/wiki/Equal_temperament)
// the numbers are semitone offsets within a single octave
const SCALE = [0, 2, 4, 5, 7, 9, 11];

// compute actual frequency for tone index in given scale
const freqForScaleTone = (i: number) =>
	2 ** (Math.floor(i / SCALE.length) + SCALE[i % SCALE.length] / 12) * C1;

// stochastic polyphonic synth/sequencer
// randomly triggers notes/voices mapped over specified octave range
// and yields stream of bounced (mixed down) samples of all voices
export class Sequencer extends AGen<number> {
	voices: Voice[];
	attackLFO: IGen<number>;
	time = 0;
	tempo: number;

	constructor(public opts: SequencerOpts) {
		super(0);
		this.tempo = (60 / this.opts.bpm) * this.opts.noteLength * FS;
		const numNotes = SCALE.length;
		const noteRange = this.opts.numOctaves * numNotes;
		const maxGain = 6 / noteRange;
		RND.seed(this.opts.seed);
		// instantiate a voice for every note in the defined scale & range
		this.voices = [
			...repeatedly(
				(i) =>
					new Voice(
						freqForScaleTone(i + this.opts.baseOctave * numNotes),
						maxGain,
						this.tempo
					),
				noteRange
			),
		];
		// Sine LFO for slowly modulating attack length
		this.attackLFO = osc(sin, 0.1 / FS, 0.1 * FS, 0.1 * FS);
	}

	// produce next sample, combining all voices
	next() {
		// always read next value from LFO
		const attackTime = this.attackLFO.next();
		// only trigger new note/voice at specified interval and using probability
		if (
			!(this.time % this.tempo) &&
			RND.probability(this.opts.probability)
		) {
			// attempt to choose a random free(!) voice
			for (let i = this.voices.length * 2; i-- > 0; ) {
				const voice = pickRandom(this.voices, RND);
				if (voice.isFree(this.time)) {
					// reset & play note
					voice.play(this.time, attackTime);
					break;
				}
			}
		}
		this.time++;
		// mixdown all voices & clamp result to [-1..1] interval
		return clamp11(
			this.voices.reduce((acc, voice) => acc + voice.gen.next(), 0)
		);
	}
}

// an individual voice for the above synth/sequencer
class Voice {
	osc: Osc;
	env: ADSR;
	filter: SVF;
	gen: IGen<number>;
	lastTrigger: number;

	// creates & initializes a voice (aka oscillator + envelope) for given
	// frequency (in Hz). initial volume is set to zero.
	constructor(freq: number, maxGain: number, tempo: number) {
		// configure oscillator (try different waveforms, see thi.ng/dsp readme)
		// use frequency assigned to this voice (normalized to FS)
		this.osc = osc(saw, freq / FS, maxGain);
		// this.osc = osc(sawAdditive(10), freq / FS, maxGain);

		// define volume envelope generator
		// https://en.wikipedia.org/wiki/Envelope_(music)#ADSR
		this.env = adsr({
			a: FS * 0.01,
			d: FS * 0.05,
			s: 0.8,
			slen: 0,
			r: FS * 0.5,
		});
		// turn down volume until activated
		this.env.setGain(0);
		// warm sounding lowpass filter (state variable filter)
		// cut-off freq will be randomized with each re-trigger
		this.filter = svfLP(1000 / FS);
		// compose signal generator & processor pipeline:
		// multiply osc with envelope, then pass through filter and filter delay
		this.gen = pipe(
			product(this.osc, this.env),
			this.filter,
			// pick random delay length
			filterFeedbackDelay(
				(tempo * pickRandom([1, 1.5, 2, 2.5], RND)) | 0,
				// 50/50 choice of lowpass vs highpass filter
				RND.probability(0.5)
					? biquadLP(1000 / FS, 1.1)
					: biquadHP(880 / FS, 1.1),
				0.8
			)
		);
		// mark voice as free/available
		this.lastTrigger = -Infinity;
	}

	play(time: number, attack: number) {
		// reset envelope & set attack time & volume
		this.env.reset();
		this.env.setAttack(attack);
		this.env.setGain(RND.minmax(0.2, 1));
		// pick random cutoff freq & resonance for voice's filter
		this.filter.setFreq(RND.minmax(200, 12000) / FS);
		this.filter.setQ(RND.minmax(0.5, 0.95));
		// update timestamp
		this.lastTrigger = time;
	}

	// returns true if voice is playable again (here arbitrarily after 0.5 secs)
	isFree(time: number) {
		return time - this.lastTrigger > 0.5 * FS;
	}
}
