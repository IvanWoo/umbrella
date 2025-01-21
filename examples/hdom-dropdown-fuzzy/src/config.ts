// SPDX-License-Identifier: Apache-2.0
export const state = {
	countries: {
		open: false,
		filter: "",
		items: [
			"Afghanistan",
			"Albania",
			"Algeria",
			"Andorra",
			"Angola",
			"Antigua and Barbuda",
			"Argentina",
			"Armenia",
			"Australia",
			"Austria",
			"Azerbaijan",
			"Bahamas",
			"Bahrain",
			"Bangladesh",
			"Barbados",
			"Belarus",
			"Belgium",
			"Belize",
			"Benin",
			"Bhutan",
			"Bolivia",
			"Bosnia and Herzegovina",
			"Botswana",
			"Brazil",
			"Brunei",
			"Bulgaria",
			"Burkina Faso",
			"Burundi",
			"Cabo Verde",
			"Cambodia",
			"Cameroon",
			"Canada",
			"Central African Republic (CAR)",
			"Chad",
			"Chile",
			"China",
			"Colombia",
			"Comoros",
			"Democratic Republic of the Congo",
			"Republic of the Congo",
			"Costa Rica",
			"Cote d'Ivoire",
			"Croatia",
			"Cuba",
			"Cyprus",
			"Czech Republic",
			"Denmark",
			"Djibouti",
			"Dominica",
			"Dominican Republic",
			"Ecuador",
			"Egypt",
			"El Salvador",
			"Equatorial Guinea",
			"Eritrea",
			"Estonia",
			"Eswatini (formerly Swaziland)",
			"Ethiopia",
			"Fiji",
			"Finland",
			"France",
			"Gabon",
			"Gambia",
			"Georgia",
			"Germany",
			"Ghana",
			"Greece",
			"Grenada",
			"Guatemala",
			"Guinea",
			"Guinea-Bissau",
			"Guyana",
			"Haiti",
			"Honduras",
			"Hungary",
			"Iceland",
			"India",
			"Indonesia",
			"Iran",
			"Iraq",
			"Ireland",
			"Israel",
			"Italy",
			"Jamaica",
			"Japan",
			"Jordan",
			"Kazakhstan",
			"Kenya",
			"Kiribati",
			"Kosovo",
			"Kuwait",
			"Kyrgyzstan",
			"Laos",
			"Latvia",
			"Lebanon",
			"Lesotho",
			"Liberia",
			"Libya",
			"Liechtenstein",
			"Lithuania",
			"Luxembourg",
			"Macedonia (FYROM)",
			"Madagascar",
			"Malawi",
			"Malaysia",
			"Maldives",
			"Mali",
			"Malta",
			"Marshall Islands",
			"Mauritania",
			"Mauritius",
			"Mexico",
			"Micronesia",
			"Moldova",
			"Monaco",
			"Mongolia",
			"Montenegro",
			"Morocco",
			"Mozambique",
			"Myanmar (formerly Burma)",
			"Namibia",
			"Nauru",
			"Nepal",
			"Netherlands",
			"New Zealand",
			"Nicaragua",
			"Niger",
			"Nigeria",
			"North Korea",
			"Norway",
			"Oman",
			"Pakistan",
			"Palau",
			"Palestine",
			"Panama",
			"Papua New Guinea",
			"Paraguay",
			"Peru",
			"Philippines",
			"Poland",
			"Portugal",
			"Qatar",
			"Romania",
			"Russia",
			"Rwanda",
			"Saint Kitts and Nevis",
			"Saint Lucia",
			"Saint Vincent and the Grenadines",
			"Samoa",
			"San Marino",
			"Sao Tome and Principe",
			"Saudi Arabia",
			"Senegal",
			"Serbia",
			"Seychelles",
			"Sierra Leone",
			"Singapore",
			"Slovakia",
			"Slovenia",
			"Solomon Islands",
			"Somalia",
			"South Africa",
			"South Korea",
			"South Sudan",
			"Spain",
			"Sri Lanka",
			"Sudan",
			"Suriname",
			"Sweden",
			"Switzerland",
			"Syria",
			"Taiwan",
			"Tajikistan",
			"Tanzania",
			"Thailand",
			"Timor-Leste",
			"Togo",
			"Tonga",
			"Trinidad and Tobago",
			"Tunisia",
			"Turkey",
			"Turkmenistan",
			"Tuvalu",
			"Uganda",
			"Ukraine",
			"United Arab Emirates (UAE)",
			"United Kingdom (UK)",
			"United States of America (USA)",
			"Uruguay",
			"Uzbekistan",
			"Vanuatu",
			"Vatican City (Holy See)",
			"Venezuela",
			"Vietnam",
			"Yemen",
			"Zambia",
			"Zimbabwe",
		].map((x, i) => [i, x]),
	},
};

export const theme = {
	root: {
		class: "sans-serif",
	},
	column: {
		class: "fl w-100 w-50-ns w-33-l pa2",
	},
	input: {
		class: "bg-transparent w-100 bn pa2",
	},
	dd: {
		root: { class: "" },
		bodyClosed: {
			style: {
				"max-height": 0,
				"overflow-y": "hidden",
				opacity: 0,
			},
		},
		bodyOpen: {
			style: {
				"max-height": "calc(11 * 1.8rem)",
				"overflow-y": "scroll",
				opacity: 1,
				transition: "all 100ms ease-in",
			},
		},
		item: {
			class: "pointer link db w-100 ph3 pv2 black hover-bg-washed-green bg-animate bb b--moon-gray",
		},
		itemSelected: {
			class: "pointer link db w-100 ph3 pv2 black hover-bg-light-gray bg-animate bb b--moon-gray b",
		},
		itemDisabled: { class: "db w-100 ph3 pv2 gray bb b--moon-gray" },
	},
	fuzzy: {
		class: "b underline",
	},
};
