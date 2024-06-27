import { useEffect, useRef } from "react";
import { useSearchResultContext } from "../../context/SearchResultContext"
import PostContent from "../Posts/PostContent";
import { useIntersection } from "@mantine/hooks";
import LoadingSpinner from "../Common/LoadingSpinner";

const SearchPage = () => {

    const { searchTerm, searchPosts, getSearchPosts, isLoadingSearchPosts } = useSearchResultContext();

    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    useEffect(() => {
        if (entry?.isIntersecting && searchPosts.length) {
            getSearchPosts(searchTerm, searchPosts[searchPosts.length - 1].paginationToken);
        }
    }, [entry])

    return (
        <div className="bg-zinc-50 size-full">
            <div className="size-full flex flex-col">
                <p className="p-4 font-semibold text-4xl">{"Search Results"}</p>
                <p className="px-4 text-lg">{`Showing Results for: "${searchTerm}"`}</p>
                <br />
                <div className="overflow-y-scroll">
                    <div className="flex-1 flex justify-center">
                        <div className="flex flex-col sm:max-w-md w-full mx-5">
                            {
                                searchPosts.map((post, index) => {
                                    if (index === searchPosts.length - 1) {
                                        return <div className="border border-gray-300 rounded-md overflow-hidden shadow-md w-full mb-4" >
                                            <PostContent post={post} />
                                            <div ref={ref} className="invisible" />
                                        </div>
                                    }
                                    return <div className="border border-gray-300 rounded-md overflow-hidden shadow-md w-full mb-4" >
                                        <PostContent post={post} />
                                    </div>
                                })
                            }
                            {isLoadingSearchPosts &&
                                <div className="w-full p-1">
                                    <div className="w-16 h-16 mx-auto"><LoadingSpinner /></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage