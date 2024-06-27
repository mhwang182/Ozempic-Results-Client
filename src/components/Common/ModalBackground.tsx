import { ReactElement } from "react"

const ModalBackground = ({ children }: { children: ReactElement }) => {
    return (
        <div className="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalBackground