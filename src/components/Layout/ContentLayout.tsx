import { ReactElement } from "react"

const ContentLayout = ({ children }: { children: ReactElement }) => {
    return <div className="h-screen w-full overflow-y-scroll" style={{ overflowAnchor: "none" }}>
        {children}
    </div>
}

export default ContentLayout