import { getAllIssues, getIsFetching, getLastPagesCount, getLastSyncTime, saveOrUpdateIssues, setIsFetching, setLastPagesCount, setLastSyncTime } from "@/app/services/redis/customFunctions";

const MILISECONDS_IN_MIUNTE = 60 * 1000;
const MAX_PER_PAGE=100;

export async function GET() {
  const [lastSyncInMili, lastPagesCount, isFetching] = 
    await Promise.all([getLastSyncTime(), getLastPagesCount(), getIsFetching()]);
  const since: string = new Date(lastSyncInMili).toISOString();
  let pagesCount = 0;
  let lastIssuesCount = MAX_PER_PAGE;
  const newIssues = [];

  try {
    if((lastSyncInMili + lastPagesCount*MILISECONDS_IN_MIUNTE) < Date.now() && !isFetching) {
      await setIsFetching(true);
      while(lastIssuesCount === MAX_PER_PAGE) {
        const res = await fetch(
        `https://api.github.com/repos/treeverse/lakeFS/issues?since=${since}&per_page=${MAX_PER_PAGE}&page=${pagesCount+1}`);
        const data = await res.json();
        lastIssuesCount = data.length;
        pagesCount++;
        newIssues.push(...data.filter((issue: {pull_request: object}) => !issue.pull_request));
      }
      
      await Promise.all([
        setLastSyncTime(new Date().getTime()),
        setLastPagesCount(pagesCount),
        saveOrUpdateIssues(newIssues),
      ]);
    }
  } catch (error) {
    console.error('Failed to fetch from github', error);
  } finally {
    await setIsFetching(false);
  }
  const allIssues = await getAllIssues();

  return new Response(JSON.stringify(allIssues), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};