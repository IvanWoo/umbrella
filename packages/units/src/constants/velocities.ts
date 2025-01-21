// SPDX-License-Identifier: Apache-2.0
import { quantity } from "../unit.js";
import { m_s } from "../units/velocity.js";

/**
 * https://en.wikipedia.org/wiki/Speed_of_light
 */
export const SPEED_OF_LIGHT = quantity(299792458, m_s);

/**
 * At 20 degree celsius
 */
export const SPEED_OF_SOUND_IN_AIR = quantity(343.14, m_s);

/**
 * At 20 degree celsius
 */
export const SPEED_OF_SOUND_IN_WATER = quantity(1482, m_s);
