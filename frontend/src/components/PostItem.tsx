import Link from 'next/link';
import Image from 'next/image';
import {Post} from '../models/Post';
import {dateToText} from '../utils/date';
import imageLoader from '../utils/image-loader';

interface Props {
    post: Post;
}

export default function PostItem(props: Props) {
    const post = props.post;
    const link = `/nieuws/post/${post.slug}`;
    
    return <Link href={link}>
        <a className="shadow shadow-[#0004] bg-gray-50 hover:shadow-lg hover:shadow-[#0004] transition-shadow rounded flex flex-col md:flex-row items-stretch">
            <div className="p-4 basis-1/2 flex flex-col gap-4 justify-between items-start">
                <div>
                    <h1 className="font-title text-3xl font-bold">{post.title}</h1>
                    <p className="text-faded">
                        <span>{post.author}</span>
                        <span className="mx-2">&#xB7;</span>
                        <span>{dateToText(new Date(post.publishedAt))}</span>
                    </p>
                </div>
                <button className="button-primary text-xl inline-block"
                        tabIndex={-1}>
                    Lees meer
                </button>
            </div>
            {post.banner &&
                <div className="relative basis-1/2 min-h-[12rem] md:min-h-0">
                    <Image loader={imageLoader}
                           src={post.banner}
                           alt="Artikel-banner"
                           objectFit="cover"
                           objectPosition="center"
                           layout="fill"/>
                </div>}
        </a>
    </Link>;
}