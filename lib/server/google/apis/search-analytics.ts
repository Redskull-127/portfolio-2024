'use server';
import { GetAuth } from '../auth';
import { google, webmasters_v3 } from 'googleapis';

const getWebmaster = async () => {
  const auth = await GetAuth.getAuth(
    {
      PROJECT_ID: process.env['GCP_PROJECT_ID'] as string,
      PRIVATE_KEY_ID: process.env['GCP_PRIVATE_KEY_ID'] as string,
      PRIVATE_KEY: process.env['GCP_PRIVATE_KEY'] as string,
      CLIENT_EMAIL: process.env['GCP_CLIENT_EMAIL'] as string,
    },
    ['https://www.googleapis.com/auth/webmasters.readonly'],
  );
  return google.webmasters({
    version: 'v3',
    auth: auth,
  });
};

const getSearchAnalytics = async () => {
  const webmasters = await getWebmaster();
  const query = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:meertarbani.in',
    requestBody: {
      startDate: process.env['ANALYTICS_VIEW_START_DATE'] as string, // this returns date from exact 1 month back from today
      endDate: new Date().toISOString().split('T')[0],
      dimensions: ['query'],
    },
  });
  return query.data;
};

const calculateTotalVisits = async (
  params: webmasters_v3.Schema$SearchAnalyticsQueryResponse,
) => {
  let totalClicks = 0;
  let totalImpressions = 0;
  params.rows?.forEach((row) => {
    totalClicks += row.clicks ?? 0;
    totalImpressions += row.impressions ?? 0;
  });
  return params.rows?.reduce((acc, curr) => {
    return acc + (curr.clicks ?? 0) + (curr.impressions ?? 0);
  }, 0);
};

const getSearchAnalyticsLastMonths = async (
  data: webmasters_v3.Schema$SearchAnalyticsQueryResponse,
) => {
  const dataRows = data.rows;
  const lastMonthsData = dataRows?.slice(0, 3);
  const calculatedLastMonthsData = lastMonthsData?.map((row, index) => {
    return {
      month: new Date(
        new Date().setMonth(new Date().getMonth() - index),
      ).toLocaleString('default', { month: 'long' }),
      visits: (row.clicks ?? 0) + (row.impressions ?? 0),
    };
  });

  return calculatedLastMonthsData?.toReversed();
};

export const getTotalVisits = async () => {
  const searchAnalytics = await getSearchAnalytics();
  const TotalVisits = await calculateTotalVisits(searchAnalytics);
  const LastMonthsVisits = await getSearchAnalyticsLastMonths(searchAnalytics);
  return { TotalVisits, LastMonthsVisits };
};
