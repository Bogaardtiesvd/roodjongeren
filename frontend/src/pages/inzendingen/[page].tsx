import Head from 'next/head';
import {fetchFallbackBanner, fetchPosts} from '../../utils/backend';
import {Post, PostType} from '../../models/Post';
import {StrapiPagination} from '../../models/strapi';
import CollectionViewer from '../../components/CollectionViewer';
import PostItem from '../../components/PostItem';
import {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult} from 'next';
import {ParsedUrlQuery} from 'querystring';
import Banner from '../../components/Banner';
import Main from '../../components/Main';
import {revalidate} from '../../utils/revalidate';

interface Params extends ParsedUrlQuery {
    page: string;
}

interface Props {
    banner: string;
    submissions: Post[];
    pagination: StrapiPagination;
}

export default function InzendingenPage(props: Props) {
    return <div>
        <Head>
            <title>Inzendingen</title>
        </Head>
        <Banner title="Inzendingen" background={props.banner} compact/>
        <Main className="container">
            <CollectionViewer pagination={props.pagination} pageItems={props.submissions.length} urlPrefix="/inzendingen/">
                <div className="flex flex-col gap-6 pb-4">
                    {props.submissions.map(post => <PostItem key={post.slug} post={post}/>)}
                </div>
            </CollectionViewer>
        </Main>
    </div>;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const {pagination} = await fetchPosts(PostType.SUBMISSION);
    const paths = [...Array(pagination.pageCount).keys()].map((pageIndex: number) => ({
        params: {
            page: (pageIndex + 1).toString()
        }
    }));
    
    return {
        paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const params = context.params as Params;
    const page = parseInt(params.page);
    
    const [{posts, pagination}, banner] = await Promise.all([
        fetchPosts(PostType.SUBMISSION, null, null, page, 8),
        fetchFallbackBanner()
    ]);
    
    return {
        props: {banner, submissions: posts, pagination},
        revalidate
    };
}