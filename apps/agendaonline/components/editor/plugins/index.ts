import { trustPlugin } from "./trust-plugin"
import { servicesPlugin } from "./services-plugin"
import { faqPlugin } from "./faq-plugin"
import { aboutPlugin } from "./about-plugin"
import { beforeAfterPlugin } from "./before-after-plugin"
import { contactPlugin } from "./contact-plugin"
import { schedulingPlugin } from "./scheduling-plugin"
import { practiceAreasPlugin } from "./practice-areas-plugin"
import { teamPlugin } from "./team-plugin"

export const AGENDA_PLUGINS = [
  trustPlugin,
  servicesPlugin,
  practiceAreasPlugin,
  aboutPlugin,
  teamPlugin,
  beforeAfterPlugin,
  schedulingPlugin,
  faqPlugin,
  contactPlugin,
]
