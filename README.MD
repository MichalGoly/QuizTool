# CS39440 Major Project - Quiz Tool
I am looking for an Android based quiz system. The system should allow instructors to
create quizzes online for multiple choice, multiple selection, number ranges, true/false,
yes/no, text answers and perhaps others. During a quiz session the instructor displays (on
his teaching machine) the quiz "slides" which the students will see displayed in sync via
an Android app on their mobile device (smartphone, tablet). Students will see appropriate input
controls on app depending on the kind of slide presented. The answers are submitted with an
indicator on the instructor machine showing the percentage of respondents that have submitted.
The instructor should be able to then display the results as an appropriate bar graph and be able
to store the results in a csv or XML file for later analysis. It should be possible to recreate
the slides with results based on this file.

The system would be server based, and so some kind of session identifier would be required so that
multiple sessions can be run at the same time. Simple authentication would also be useful.

Being able to embed quiz slide material with other HTML material would be useful. Using an existing
editing component to generate the HTML might be a sensible approach.
