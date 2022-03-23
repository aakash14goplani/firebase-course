import { db } from "./init";
import { firestore } from "firebase-admin";
import FieldValue = firestore.FieldValue;

export default async (snap, context) => {
  // snap -> contains data in that document
  // context -> holds info like the path of the document e.g. courses/{courseId}

  const course = snap.data();

  if (!course.promo) {
    return;
  }

  return db.doc('courses/stats').update({
    totalPromo: FieldValue.increment(-1)
  });
}
