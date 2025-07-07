import CourseCardComponent from "@/app/client/components/reusableComponents/CoursesCard";


const Courses = () => {
    const courses = [
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQCQAyQEsN3gPk5JYVuQWCksBYpM0IlmBDQ&s",
            title: "Advanced React Patterns",
            description: "Master modern React techniques",
            creator: {
                name: "Jane Doe",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_8H4FF_Lr9V_NpU7SyDRCcnLwB5V9o5DAsg&s"
            },
            topics: [
                "State Management",
                "Component Composition",
                "Performance Optimization",
            ],
        },
        // Add more courses...
    ];
    return (
        <div className="lg:col-span-16 px-4 flex flex-col gap-4">

            <div className="w-fit md:mx-auto lg:m-0">
                <h1 className="font-bold text-xl ">Courses</h1>
            </div>


            <div className="grid max-lg:grid-cols-2 lg:grid-cols-3 gap-6 py-4 justify-items-center">
                {courses.map((course, index) => (
                    <CourseCardComponent
                        key={index}
                        imageUrl={course.imageUrl}
                        title={course.title}
                        description={course.description}
                        creator={course.creator}
                        topics={course.topics}
                    />
                ))}
            </div>
        </div>
    )
}

export default Courses