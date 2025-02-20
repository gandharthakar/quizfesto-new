import WinnerPrizeForm from "@/app/components/admin/WinnerPrizeForm";
import TokenChecker from "@/app/libs/tokenChecker";

function Page() {

    return (
        <>
            <TokenChecker is_admin={true} />
            <div className="py-[25px]">
                <div className="pb-[20px] last:pb-0">
                    <WinnerPrizeForm
                        prize_type_text={1}
                        prize_possition_text="st"
                    />
                </div>
                <div className="pb-[20px] last:pb-0">
                    <WinnerPrizeForm
                        prize_type_text={2}
                        prize_possition_text="nd"
                    />
                </div>
                <div className="pb-[20px] last:pb-0">
                    <WinnerPrizeForm
                        prize_type_text={3}
                        prize_possition_text="rd"
                    />
                </div>
            </div>
        </>
    )
}

export default Page;
