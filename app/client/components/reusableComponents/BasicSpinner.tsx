

const BasicSpinner = () => {
    return (

            <div className="flex flex-auto flex-col justify-center items-center">
                <div className="flex justify-center">
                    <div className={`animate-spin inline-block size-4 border-3 border-current border-t-transparent text-red-600 rounded-full dark:text-red-500" role="status" aria-label="loading`}>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        
    )
}

export default BasicSpinner