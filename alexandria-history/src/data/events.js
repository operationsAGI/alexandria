// Alexandria event history, sourced from "Alexandria: A History.docx" plus
// the original brief. Do not invent or alter entries. RSVP links point to
// the Luma page (https://luma.com/user/agihouse), which is now the RSVP
// hub for events, in place of the original per-event Partiful pages.
// Internal-only artifacts (CRM sheet, attendee CSVs, guest attendance
// sheets, raw Drive photo/video files, working docs) are intentionally
// excluded from this public timeline.
// Types: Silent, Community, Read-a-thon, Paper Reading, Reading Night

export const events = [
  { date: '2023-10-04', title: 'Silent Reading Night', type: 'Silent',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2023-11-01', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2023-11-29', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-01-10', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-01-17', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-01-31', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-02-21', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-03-06', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-03-20', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-04-03', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-05-01', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-05-15', title: 'Community Reading Night', type: 'Community',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-06-21', title: 'Reading Rave: Lo-Fi Edition', type: 'Read-a-thon',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-08-11', title: 'Commons Reading Lo-Fi Rave: 5hr Read-a-Thon', type: 'Read-a-thon',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-08-29', title: 'AI for Science Research Frontier: Paper Reading', type: 'Paper Reading',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-10-10', title: 'Intelligence & Information: Literary Revelations', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse',
    bookMap: 'https://www.youtube.com/watch?v=ruJYhM6isw4' },
  { date: '2024-10-17', title: 'Holy Books: Religion Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse',
    bookMap: 'https://www.youtube.com/watch?v=C5Z-Ls5mWhM',
    talks: 'https://www.youtube.com/watch?v=vof9c8eNYTs' },
  { date: '2024-10-24', title: 'The Language of Reality: Mathematics Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse',
    talks: 'https://www.youtube.com/watch?v=ZGIREn14ejY' },
  { date: '2024-11-07', title: 'The Road to Reality: Physics Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2024-11-13', title: 'The Deep Questions: Philosophy Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse',
    bookMap: 'https://www.youtube.com/watch?v=mrTXZ_uwghU' },
  { date: '2025-04-10', title: 'Silent Reading Night: Mortality and Meaning', type: 'Silent',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-05-04', title: 'Reading Marathon', type: 'Read-a-thon',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-05-07', title: 'Post-Labor Economics Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-06-19', title: 'Mathematics [Technical Omnicompetence]', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-07-03', title: 'Physics [Technical Omnicompetence]', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-08-07', title: 'Mechanical Engineering [Technical Omnicompetence]', type: 'Reading Night',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2025-12-14', title: 'Reading Marathon', type: 'Read-a-thon',
    rsvp: 'https://luma.com/user/agihouse' },
  { date: '2026-06-23', title: 'Post-Labor Economics Reading Night', type: 'Reading Night',
    rsvp: 'https://luma.com/economicsnight' },
  { date: '2026-07-09', title: 'The Crossing: From Fantasy to Reality', type: 'Reading Night',
    rsvp: 'https://luma.com/ScienceFictionReadingNight' },
]

export const eventsByYear = events.reduce((acc, ev) => {
  const year = ev.date.slice(0, 4)
  if (!acc[year]) acc[year] = []
  acc[year].push(ev)
  return acc
}, {})
