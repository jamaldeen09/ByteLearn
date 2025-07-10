"use client"
import { useAppSelector, useAppDispatch } from "@/app/redux/essentials/hooks"
import { untriggerNewGroup } from "@/app/redux/triggers/groupCreationTrigger"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftIcon } from "lucide-react"
import GroupMembers from "./GroupMembers"

const AddGroupTrigger = () => {
    const groupTrigger = useAppSelector(state => state.newGroupTrigger.triggerNewGroup)
    const dispatch = useAppDispatch()
    const generateArray = (lastNum: number): number[] => {
        let generatedArr: number[] = [];
        for (let i = 0; i < lastNum; i++) {
            generatedArr.push(i)
        }

        return generatedArr
    }
    return (
        <AnimatePresence>
            {groupTrigger && (
                <div className="inset-0 absolute h-full">

                    <motion.div
                        key="addgroup-sidebar"
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100vw" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full h-full z-50
                        flex flex-col gap-6"
                    >
                        {/* Header */}
                        <div className="w-full flex items-center space-x-4 px-6 py-4">
                            <ArrowLeftIcon onClick={() => dispatch(untriggerNewGroup())} className="w-5 h-5 hover:cursor-pointer" />
                            <p>New Group</p>
                        </div>

                        {/* Group Name */}
                        <div className="w-full flex flex-col px-6">
                            <Input
                                placeholder="Group Name"
                                type="text"
                                className="px-8 h-12 rounded-full"
                            />
                            <p className="text-red-600"></p>
                        </div>

                        {/* Group Members */}

                        <div className="w-full flex flex-col gap-4 px-6">
                            <h4>Added Members</h4>

                            <div className="w-full border min-h-fit 
                            grid grid-cols-4">

                            </div>
                        </div>
                        <div className="w-full px-6">
                            <button className="bg-black text-white px-3 text-xs py-2 rounded-full dont-bold hover:cursor-pointer hover:brightness-90 transition-all duration-200">
                                Create
                            </button>
                        </div>
                        {/* People to add  */}
                        <div className=" overflow-y-auto h-full flex flex-col px-4 gap-6">
                            <div className="w-full px-6">
                                <p>B</p>
                            </div>
                            <div className="h-full flex flex-col gap-4 ">
                                {Array.from(generateArray(10)).map((i) => {
                                    return (
                                        <GroupMembers key={i} />
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default AddGroupTrigger