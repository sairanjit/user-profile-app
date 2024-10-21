export const defaultUserData = {
  name: "Sai Ranjit",
  email: "sairanjit@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/34263716?v=4",
  location: "Pune, India",
  bio: "Software Developer passionate about creating amazing mobile experiences",
  phone: "+91 (984) 802-2338",
  socialLinks: {
    twitter: "@sairanjit_",
    linkedin: "linkedin.com/in/sairanjit",
    github: "github.com/sairanjit",
  },
  seat: {
    seatType: "Business Class",
    seatLocation: "Window",
  },
  food: {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
  },
  accommodation: {
    roomType: "Single",
    roomLocation: "Window",
    ratings: "4.5",
    budget: "Mid Range",
  },
  travel: {
    modeOfTransportation: "Train",
    budget: "Mid Range",
    season: "Summer",
  },
}

export type User = {
  name: string
  email: string
  avatar: string
  location: string
  bio: string
  phone: string
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
  }
  seat: {
    seatType: string
    seatLocation: string
  }
  food: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
  }
  accommodation: {
    roomType: string
    roomLocation: string
    ratings: string
    budget: string
  }
  travel: {
    modeOfTransportation: string
    budget: string
    season: string
  }
}
