LEARNER SCORE MASTER SHEET - DESKTOP APP (Firebase version)
===========================================================
Read FIREBASE-SETUP.txt first. It explains how to create the Firebase project and
fill in firebase-config.js. Without it the app only shows "Firebase isn't set up yet".

One-time setup on the computer where you build the app (needs internet):
  1. Install Node.js (LTS) from https://nodejs.org
  2. Open Command Prompt in this folder (the one containing package.json)
  3. Run:  npm install

Run the app:        npm start
Make a copy for other computers:   npm run build   -> dist\win-unpacked (copy the whole folder; the program is "Learner Score Master Sheet.exe")

Using it:
  - The first start creates the administrator account (real email + password).
  - The administrator creates the class tests and mock exams under "Assessments" and adds
    the class teachers under "Teachers".
  - Everyone opens an assessment from the dropdown at the top. A teacher only sees the
    assessments that are open to their grade. A mock exam uses the BECE aggregate, a class
    test uses total and position.
  - "Overview" shows which teacher has entered what and who has submitted. Click a cell to
    read that sheet.
  - Teachers click "Submit to administrator" when a sheet is complete; the administrator is
    notified (pop-up while the app is open, red number on "Notifications").
  - Passwords have a Show/Hide button when typed.
  - Data is stored in your Firebase project, so it is the same on every computer.

Phones and tablets: see the "web-hosting" folder next to this one (HOSTING-SETUP.txt).
It puts the same app on the internet so teachers can open it on any phone, tablet or
computer, and add it to the home screen.

Screen layout (v2):
  - Top bar: the "Sheet" list (choose any class test or mock exam), the save status, and your
    name menu (My account, Sign out).
  - Administrators also get a "Manage" strip under the top bar: Overview, Master sheet,
    Notifications, Assessments, Teachers. Administrators open on the Overview.
  - On a sheet: the heading shows the title, term, class and status, plus the Submit button.
    Download PDF and add rows are on the top toolbar. Under it, a view bar holds Sort by, Live
    sorting and four small menus: Filter, Subjects, Text and colours, and More (sheet details
    and Clear all). A blue dot on Filter and a chip with a cross show when a filter is on.
  - On Assessments and Teachers pages the list comes first; the forms are folded away - click
    "+ Add..." / "+ Create..." to open them.

Light and dark modes:
  - The Light / Dark / Auto switch is in the top bar (and under the sign-in box).
  - Light is a colourful indigo, violet and pink theme; Dark is a deep indigo theme.
  - Auto follows your phone or computer setting. Your choice is remembered on each device.
  - PDFs always print in the same clean colours, whichever mode you use.

Your name and your own icon:
  - Your name: package.json -> "author" and build -> "copyright" already say Eric. Change them
    there if you want something different. (Do NOT rename the "electron" package itself - the
    app needs it to run. Only the settings around it are yours to change.)
  - To rename the program (for example "Eric Score Sheet.exe"), change "productName" in BOTH
    places in package.json, then run npm run build again.
  - Your icon: replace  icon.png  (square, at least 256 x 256) and  build\icon.ico  (a Windows
    icon with a 256 x 256 size) with your own picture, then rebuild. The window and taskbar
    show icon.png straight away.
  - The icon is stamped onto the program file automatically when you build (afterPack.js
    does it; no administrator needed). After changing the icon files run:
        npm install      (once, to fetch the small "rcedit" helper)
        npm run build
    If an old icon still shows, uninstall the old app first, install the new Setup, and restart
    Windows Explorer (or sign out and in) so Windows refreshes its icon cache.
  - Phones: replace web-hosting\public\icon-192.png and icon-512.png (square pictures of
    those sizes) and run  firebase deploy.

Installing on other computers:
  WINDOWS
    - Quick way: after  npm run build , copy the whole  dist\win-unpacked  folder to the other PC
      and double-click "Learner Score Master Sheet.exe".
    - A real Setup.exe: remove  "signAndEditExecutable": false  from package.json, open Command
      Prompt "as administrator", run  npm run build . The installer is in the dist folder.
  MAC (must be built ON a Mac)
    1. Install Node.js (LTS) from nodejs.org.
    2. Copy this app folder to the Mac (leave out node_modules and dist).
    3. In Terminal, inside the folder:  npm install   then   npm run build:mac
    4. Open the .dmg in the dist folder and drag the app into Applications.
    5. First open: right-click the app > Open > Open (the app is not signed by Apple).
       If macOS says it is damaged, run in Terminal:
         xattr -cr "/Applications/Learner Score Master Sheet.app"
    - No build needed on a Mac: open the web address from  firebase deploy  in Safari or Chrome and
      add it to the Dock / home screen.
