import { db } from "./init";
import { firestore } from "firebase-admin";
import FieldValue = firestore.FieldValue;

export default async (change, context) => {
  // change -> contains data in that document
  // context -> holds info like the path of the document e.g. courses/{courseId}

  if (context.params.courseId === 'stats') {
    return;
  }

  const newData = change.after.data();
  const oldData = change.before.data();
  let increment = 0;

  if (!oldData.promo && newData.promo) {
    increment += 1;
  } else if (oldData.promo && !newData.promo) {
    increment -= 1;
  }

  /**
   * This function will get triggered if any field in document is updated e.g. if title is updated
   * So this check will ensure that only promo field is updated, if any other field is updated then
   * return
   */
  if (increment === 0) {
    return;
  }

  return db.doc('courses/stats').update({
    totalPromo: FieldValue.increment(increment)
  });
}
