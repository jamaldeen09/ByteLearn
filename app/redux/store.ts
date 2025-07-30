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
import isFriendsReducer from "./triggers/isFriendsTrigger";
import imagePreviewReducer from "./triggers/imagePreviewTrigger"
import groupSlice from "./chatSlices/groupReducer"
import isLikedReducer from "./coursesSlices/likedStateSlice"

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
    isFriends: isFriendsReducer,
    imagePreview: imagePreviewReducer,
    groupsContainer: groupSlice,
    likedState: isLikedReducer,
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch