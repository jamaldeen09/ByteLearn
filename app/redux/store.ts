import { configureStore } from '@reduxjs/toolkit'
import timerResetSlice  from "./triggers/timerResetTrigger"
import userInformaionSlice from "./informationSlices/usersInformationSlice"
import canvasSlice from "./triggers/canvasTriggerSlice"
import courseSlice from "./coursesSlices/courseSlice"
import singleCourseSlice from "./coursesSlices/singleCourseSlice"
import completedSkillsSlice from "./coursesSlices/completedSkillsSlice"
import progressReducer from "./coursesSlices/progressSlice";
import newFriendsSlice from "./triggers/newFriendTrigger"
import newGroupSlice from "./triggers/groupCreationTrigger"
import enrolledCoursesReducer from './coursesSlices/enrolledCoursesSlice';
import friendsReducer from "./informationSlices/friendInformation"
import notificationReducer from "./chatSlices/notificationSlice"
import clickedFriendReducer from "./chatSlices/clickedFriend"
import messagesSlice from "./chatSlices/messagesSlice"

export const store = configureStore({
  reducer: {
    timerReset: timerResetSlice,
    usersInformation: userInformaionSlice,
    canvasTrigger: canvasSlice,
    coursesSlice: courseSlice,
    singleCourse: singleCourseSlice,
    completedSkills: completedSkillsSlice,
    progress: progressReducer,
    newFriendTrigger: newFriendsSlice,
    newGroupTrigger: newGroupSlice,
    enrolledCourses: enrolledCoursesReducer,
    notificationContainer: notificationReducer,
    friendsContainer: friendsReducer,
    clickedFriend: clickedFriendReducer,
    messages: messagesSlice,
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch