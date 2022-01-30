import Head from 'next/head';
import Banner from '../components/Banner';
import AboutUsShort from '../components/AboutUsShort';
import dynamic from 'next/dynamic';
import {useMemo} from 'react';
import {fetchAfdelingen, fetchHome, fetchPosts} from '../utils/backend';
import Afdeling from '../models/Afdeling';
import HomeContent from '../models/HomeContent';
import {Post} from '../models/Post';
import LatestNews from '../components/LatestNews';
import Main from '../components/Main';
import {revalidate} from '../utils/revalidate';
import {GetStaticPropsResult} from 'next';

interface Props {
    homeContent: HomeContent;
    afdelingen: Afdeling[];
    posts: Post[];
}

export default function HomePage(props: Props) {
    const content = props.homeContent;
    const AfdelingenMap = useMemo(() => dynamic(() => import('../components/AfdelingenMap'), {ssr: false}), []);
    
    return <div>
        <Head>
            <title>ROOD, Socialistische Jongeren</title>
        </Head>
        <Banner title={content.bannerTitle} subtitle={content.bannerSubtitle} background={content.banner}/>
        <Main>
            <AboutUsShort content={content.shortAboutUs}/>
            <AfdelingenMap afdelingen={props.afdelingen} compact/>
            <LatestNews posts={props.posts}/>
        </Main>
    </div>;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const [homeContent, afdelingen, {posts}] = await Promise.all([
        fetchHome(),
        fetchAfdelingen(),
        fetchPosts(1, 4)
    ]);
    
    return {
        props: {homeContent, afdelingen, posts},
        revalidate
    };
}