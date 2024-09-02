import { records, screening, user, apps, sethoscope,card } from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: apps,
    link: "/",
  },
  {
    name: "records",
    imgUrl: records,
    link: "/medical-records",
  },
  {
    name: "screening",
    imgUrl: screening,
    link: "/screening-schedules",
  },
  {
    name: 'professionals',
    imgUrl: sethoscope,
    link: '/professionals',
  },
  {
    name: 'subscriptions',
    imgUrl: card,
    link: '/subscriptions',
  },

  {
    name: "profile",
    imgUrl: user,
    link: "/profile",
  },
];
