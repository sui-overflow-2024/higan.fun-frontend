import CreateCoinForm from "@/components/CreateCoinForm";

const Page = () => {
    return (
        <div className=" min-h-[calc(100vh_-_66px)] w-full flex items-center justify-center">

            <div className=" w-[30%] min-w-[400px] form border-[#34477b] border-2 p-5 rounded-lg">
                <CreateCoinForm/>
            </div>
        </div>
    );
};

export default Page;
