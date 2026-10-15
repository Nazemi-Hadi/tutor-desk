# Tutor Desk

My Semester 1 teaching timetable as a small installable web app: the next class with a live countdown, room and building, today's list, the week board, a term overview by week and month, and links to each course on Myplace.

- **Full view:** open the site.
- **Mini window:** click *Mini window*, or open the site with `#mini` at the end of the address.
- **Install:** in Edge or Chrome, use the install icon in the address bar (or menu > Apps > Install this site as an app).

## Updating the timetable

The timetable lives in `data.json`. Edit it, raise `"version"` by 1, and commit. The app shows "Load new timetable" the next time it opens; Done and Cancelled marks are kept.

Changes made inside the app (ticks, new sessions) are saved in that browser only. Use *Import / export* to back them up or move them to another device.
