
1. A student A enters his university ID number and pswd and gets a unique token(pick a code generated uuid for now) back which is used in authentication in all further APIs for this user - sent as bearer token in the headers.
2. A sees a list of free sessions available with the dean. Each dean slot is 1 hr long and dean is only available on Thur, Fri 10 AM every week.
3. A picks one of the above slots and books.
4. Dean logins in with his university ID and pswd (similar to 1 above). Yes Dean too gets his own token.
5. Dean sees a list of all pending sessions - student name, and slot details. Currently only A.
6. Student B logs in, gets a list of free slots and books a slot.
7. Dean logs in back and sees a list of his pending sessions - both A and B.
8. Dean logs in back after slot time booked by A and he can see only B in the list. (You can simulate this by manually changing the start slot time that A booked to a past time. Yes thts is a DB manual edit)
