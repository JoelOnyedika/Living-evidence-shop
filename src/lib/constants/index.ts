import { ArrowUp, ArrowDown, Menu, Bell, Package, Home, Package2, Power, Star, Settings, MessageCircle, X, HandCoins, Gem, Book, Smile } from 'lucide-react'

export const searchBarLocationDropdownItem = [
	{
		id: 1,
		location: "Edo State"
	},
	{
		id: 2,
		location: "Anambra State"
	},
	{
		id: 3,
		location: "Kaduna State"
	},
	{
		id: 4,
		location: "Delta State"
	},
	{
		id: 5,
		location: "Lagos State"
	},
]

export const homepageDetails = [
    {
      id: 1,
      title: "Cozy Cottage in the Woods",
      description: "Charming 2-bedroom cottage with a private garden",
      price: 150,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Luxury Penthouse Apartment",
      description: "Stunning city views from this high-end apartment",
      price: 500,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Handyman Services",
      description: "Professional handyman for all your home repair needs",
      price: 50,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      title: "Landscaping and Gardening",
      description: "Maintain your outdoor space with our expert services",
      price: 75,
      image: "/placeholder.svg",
    },
    {
      id: 5,
      title: "Luxury Villa with Pool",
      description: "Spacious villa with a private pool and stunning views",
      price: 800,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      title: "Cleaning Services",
      description: "Reliable and thorough house cleaning services",
      price: 40,
      image: "/placeholder.svg",
    },
  ]

export const navbarLinks = [
  {id: 1, title: "Home", href: "/", icon: Home},
  {id: 3, title: "Sell", href: "/sell", isDynamic: true, icon: HandCoins},
  {id: 4, title: "How It Works", href: "/how-it-works", icon: Gem},
  {id: 5, title: "About Us", href: "/about", icon: Book},
  {id: 6, title: "Contact Us", href: "/contact", icon: Smile},
]

export const dashboardLinks = (id: any) => [
  {
    id: 1, title: "Dashboard", icon: Home, href: `/dashboard/${id}/dashboard`
  },
  {
    id: 2, title: "My Listing", icon: Package, href: `/dashboard/${id}/listing`
  },
  {
    id: 3, title: "Reviews", icon: Star, href: `/dashboard/${id}/reviews`
  },
  {
    id: 4, title: "Messages", icon: MessageCircle, href: `/dashboard/${id}/messages`
  },
  {
    id: 5, title: "Account Settings", icon: Settings, href:`/dashboard/${id}/settings`
  },
  {
    id: 6, title: "Logout", icon: Power, href: "/logout"
  },

]

export const countries = [
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
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
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
  "Korea, North",
  "Korea, South",
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
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
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
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];
