import { db } from "./init";
import { firestore } from "firebase-admin";
import FieldValue = firestore.FieldValue;

export default async (snap, context) => {
  // snap -> contains data in that document
  // context -> holds info like the path of the document e.g. courses/{courseId}

  const course = snap.data();

  // long-cut
  if (course.promo) {
    return db.runTransaction(async (transaction) => {
      const courseRef = db.doc('courses/stats');
      const courseSnap = await transaction.get(courseRef);
      const stats = courseSnap.data() ?? { totalPromo: 0 };
      stats.totalPromo = stats.totalPromo + 1;

      transaction.set(courseRef, stats);
    });
  }

  // short-cut
  if (course.promo) {
    return db.doc('courses/stats').update({
      totalPromo: FieldValue.increment(1)
    });
  }
}
