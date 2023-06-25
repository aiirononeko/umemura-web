import { db } from "../../app/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { format, add } from "date-fns";

const addAvailableTimes = async (date: Date) => {
  try {
    const docRef = await addDoc(collection(db, "available_times"), {
      date: format(date, "yyyy/MM/dd"),
      "10:00": false,
      "10:30": false,
      "11:00": false,
      "11:30": false,
      "12:00": false,
      "12:30": false,
      "13:00": false,
      "13:30": false,
      "14:00": false,
      "14:30": false,
      "15:00": false,
      "15:30": false,
      "16:00": false,
      "16:30": false,
      "17:00": false,
      "17:30": false,
      "18:00": false,
      "18:30": false,
      "19:00": false,
      "19:30": false,
      "20:00": false,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// 2023/06/25から1000日分のデータを作成
for (let i = 0; i < 1000; i++) {
  const date = add(new Date(), { days: i });
  addAvailableTimes(date);
}
