import type { APIRoute } from 'astro';
import { DATOCMS_READONLY_API_TOKEN } from 'astro:env/server';

export const prerender = false;

const query = `
query {
  jobPostingsMeta: _allJobPostingsMeta {
    count
  }
}
`.trim();

const getJobCount = async () => {
    const response = await fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
            Authorization: DATOCMS_READONLY_API_TOKEN,
            'Content-Type': 'application/json',
            'X-Exclude-Invalid': 'true',
            'X-Cache-Tags': 'true',
        },
        body: JSON.stringify({ query }),
    });
    const cacheTags = response.headers.get('x-cache-tags') ?? '';
    const { data } = await response.json();
    return {
        cacheTags,
        count: data.jobPostingsMeta.count,
    };
};

export const GET: APIRoute = async ({ }) => {
    const { count, cacheTags } = await getJobCount();
    const timestamp = `${new Date().toLocaleDateString('nl-NL')} ${new Date().toLocaleTimeString('nl-NL')}`;

    const body = JSON.stringify({
        count,
        cacheTags,
        timestamp,
    }, null, 2);

    return new Response(body,{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Tag': cacheTags,
        },
    });
};
