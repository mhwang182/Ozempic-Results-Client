import { ReactElement } from "react"

const ContentLayout = ({ children }: { children: ReactElement }) => {
    return <div className="w-full" style={{ overflowAnchor: "none" }}>
        {children}
    </div>
}

export default ContentLayout