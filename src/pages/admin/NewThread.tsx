import CreateThreadForm from "@/components/admin/CreateThreadForm/CreateThreadForm"



const NewThread = () => {

    return (
        <div className='w-full h-full flex flex-col sm:p-4'>
            <h3 className='text-3xl font-bold pb-4'>Create New Thread</h3>
            <CreateThreadForm />
        </div>
    )

}



export default NewThread
