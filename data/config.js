/**
 * ============================================================
 * NORTH CLASS — SITE CONFIGURATION
 * ============================================================
 * This is the master control file for the whole website.
 * Change the values below — never touch the HTML/CSS/JS files
 * to update text, colors, or contact details.
 *
 * See README.md → "9. Change Website Settings" for a full guide.
 * ============================================================
 */

const CONFIG = {

  // ---------- SITE IDENTITY ----------
  site: {
    title: "NORTH CLASS",                 // Big animated title on the homepage
    shortName: "NORTH CLASS",             // Used in the navbar + browser tab
    tagline: "Elite Class Portal",        // Small eyebrow text above the title
    motto: "BROM is him 😭🙏",           // Class motto shown under the title
    welcomeMessage: "Welcome to our class portal — built by brom, for us.",
    schoolName: "GOSETA HIGH SCHOOL",                       // e.g. "Northfield High School"
    logo: "assets/images/logo/logo.svg",  // Replace this file to change the logo
    favicon: "assets/icons/favicon.svg",  // Replace this file to change the favicon
    foundedYear: "2026"                   // Shown in the footer copyright line
  },

  // ---------- THEME COLORS ----------
  // These drive the "aurora" gradient across the whole site.
  // Use hex codes. Keep them vivid — they're used at low opacity too.
  theme: {
    defaultMode: "dark",        // "dark" or "light"
    auroraGreen:   "#35FFC0",
    auroraViolet:  "#8B6BFF",
    auroraMagenta: "#FF5FA8"
  },

  // ---------- HOMEPAGE STATISTICS ----------
  // "source" auto-counts items from your data files — leave it and the
  // number updates itself as you add/remove students, events, etc.
  // Allowed sources: "students", "announcements", "events", "assignments"
  // Or set a fixed "value" instead of "source" for anything else.
  stats: [
    { icon: "students",      label: "Students",     source: "students" },
    { icon: "megaphone",     label: "Announcements", source: "announcements" },
    { icon: "calendar",      label: "Upcoming Events", source: "events" },
    { icon: "book",          label: "Assignments",  source: "assignments" }
  ],

  // ---------- CONTACT PAGE ----------
  contact: {
    email: "bromtrader199@gmail.com",
    phone: "254745477064",
    address: "nairobi,KE",
    // Paste a full Google Maps "embed" iframe src URL here (Share → Embed a map).
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.111219401096!2d35.0598141734902!3d1.0787186623904395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178227a56222b4b9%3A0x943bcbe7e5f23b17!2sGoseta%20Boys%20High%20School!5e0!3m2!1sen!2ske!4v1785781207665!5m2!1sen!2ske" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>

    socials: {
      instagram:"https://www.instagram.com/rimuru._.tempest14?igsh=MWk1cnVrbXRwZms1dw==",
      x: "",
      facebook: "",
      whatsapp: "wa.me/254745477064",
      tiktok: ""
    }
  },

  // ---------- TEACHER CONTACTS ----------
  // Shown as cards on the Contact page. Add as many as you like.
  teachers: [
    
    {
      name: "BROM",
      role: "Class Teacher",
      subject: "MATHS",
      email: "bromtrader199@gmail.com",
      phone: "254745477064",
        photo:"https://www.image2url.com/r2/default/images/1785562176413-85ad9fb8-d753-4177-a3d1-d9169e54ca66.jpg"
    },
    
  ],

  // ---------- BACKGROUND MUSIC ----------
  music: {
    enabled: true,                                   // set false to hide the music button entirely
    file: "assets/audio/background-music.mp3",       // replace this file to change the track
    trackTitle: "Class Theme",
    defaultVolume: 0.35,
    autoplay: true                                 // browsers block autoplay with sound — keep this false
  }

};
