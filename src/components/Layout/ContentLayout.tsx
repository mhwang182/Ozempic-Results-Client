import { ReactElement } from "react"

const ContentLayout = ({ children }: { children: ReactElement }) => {
    return <div className="size-full" style={{ overflowAnchor: "none" }}>
        {children}
    </div>
}

export default ContentLayout