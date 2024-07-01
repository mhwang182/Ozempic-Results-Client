import { useState } from "react";
import { ChevronDown, CloseIcon } from "../../svgs/svgs";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React from "react";
import { Post } from "../../utils/contants";
import { Blurhash } from "react-blurhash";
import { MedicationToTradeName, getDateString, parseBlurHash } from "../../utils/contants";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PostContent = (props: { post: Post, onClose?: () => void, clickable?: boolean }) => {

    const [direction, setDirection] = useState('slide-right');
    const [imgPage, setImgPage] = useState(0);

    const location = useLocation();

    const navigate = useNavigate();

    const { post, clickable, onClose } = props;

    const childfactory = (direction: any) =>
        (child: React.FunctionComponentElement<{ classNames: any; }>) =>
            React.cloneElement(child, {
                classNames: direction
            })

    const slideRight = () => {
        setDirection('slide-right');
        setImgPage(1);
    }

    const slideLeft = () => {
        setDirection('slide-left');
        setImgPage(0);
    }

    const ImageContainer = ({ imgUrl, filename }: { imgUrl: string | undefined, filename: string }) => {
        return (
            <>
                <div className={`size-full absolute `}>
                    <div className="size-full absolute">
                        <Blurhash hash={parseBlurHash(filename)} height={'100%'} width={'100%'} />
                    </div>
                    <img className='size-full absolute z-10 object-contain'
                        src={imgUrl ? imgUrl : ""}
                        loading="eager"
                        alt=""
                    />
                </div>
            </>
        )
    }

    const navigatePost = () => {
        if (clickable) {
            navigate(`/post/${post._id}`, { state: { previousLocation: location, post } })
        }
    }

    const isOpen = !!onClose;

    return (
        <div className="bg-white py-3 flex flex-col space-y-3 items-center rounded-md">
            <div className={`w-full px-3 flex flex-row justify-between ${clickable ? 'hover:cursor-pointer' : ''}`}
                onClick={navigatePost}
            >
                <span>
                    {post.userDetails && <p className="font-semibold text-sm">Posted By: {post.userDetails.username}</p>}
                    <p className="text-slate-500 text-sm">{getDateString(post.createdAt)}</p>
                </span>

                {isOpen && <button
                    onClick={onClose}
                    className=""
                >
                    <CloseIcon />
                </button>}
            </div>
            <div className="w-full aspect-[3/4] max-h-[500px] relative" >
                <div className="absolute z-30 size-full flex items-center justify-between px-2 overflow-hidden">
                    <button
                        className="w-6 h-6 rounded-full bg-white opacity-70 rotate-90 flex items-center justify-center"
                        onClick={slideLeft}
                    >
                        <ChevronDown />
                    </button>
                    <button
                        className="w-6 h-6 rounded-full bg-white opacity-70 flex items-center justify-center -rotate-90"
                        onClick={slideRight}
                    >
                        <ChevronDown />
                    </button>
                </div>
                <TransitionGroup childFactory={childfactory(direction)}>
                    <CSSTransition
                        key={imgPage}
                        timeout={300}
                        classNames={direction}
                    >
                        <ImageContainer
                            imgUrl={[post?.beforeImageUrl, post?.afterImageUrl][imgPage]}
                            filename={[post?.beforeImageId, post?.afterImageId][imgPage]}
                        />
                    </CSSTransition>
                </TransitionGroup>

            </div>
            <div
                className={`w-full h-fit flex px-2 flex-wrap ${clickable ? 'hover:cursor-pointer' : ''}`}
                onClick={navigatePost}
            >
                <div className="w-fit py-2 px-4 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full text-sm text-white mr-2 mb-2 font-semibold">
                    {`${MedicationToTradeName[post.medicationUsed]} (${post.medicationUsed})`}
                </div>
                <div className="w-fit p-2 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full text-sm text-white mr-2 mb-2 font-semibold">
                    {`${post.weightLost} (lbs lost)`}
                </div>
            </div>
            <div
                className={`w-full px-3 text-sm flex ${clickable ? 'hover:cursor-pointer' : ''}`}
                onClick={navigatePost}
            >
                {isOpen ?
                    <p>
                        {post.userDetails &&
                            <p className="font-semibold w-fit float-left">{`${post.userDetails.username}: `} </p>
                        }&nbsp;
                        {post.caption}
                    </p> :
                    <Link to={`/post/${post._id}`} state={{ previousLocation: location, post }}>
                        <div className={`text-ellipsis overflow-hidden whitespace-nowrap w-full sm:max-w-[390px] max-w-56`}>
                            {post.userDetails &&
                                <p className="font-semibold w-fit float-left">{`${post.userDetails.username}: `} </p>
                            }&nbsp;
                            {post.caption}
                        </div>
                    </Link>
                }

            </div>
        </div>
    )
}

export default PostContent