import { Issue } from "@/app/types/issue";
import redis, { getValue, setValue } from ".";

const ISSUES_REDIS_KEY = 'issues';
const LAST_SYNC_TIME_KEY = 'lastSyncTime';
const LAST_PAGES_COUNT_KEY = 'lastPagesCount';
const IS_FETCHING_KEY = 'isFetching';

export const getLastSyncTime = async (): Promise<number> => {
    const value = await getValue(LAST_SYNC_TIME_KEY);
    return value ? Number(value) : 0;
}

export const setLastSyncTime = async (value: number): Promise<void> => 
    setValue(LAST_SYNC_TIME_KEY, String(value));

export const getLastPagesCount = async (): Promise<number> => {
    const value = await getValue(LAST_PAGES_COUNT_KEY);
    return value ? Number(value) : 0;
}

export const setLastPagesCount = async (value: number): Promise<void> => 
    setValue(LAST_PAGES_COUNT_KEY, String(value));


export const getIsFetching = async (): Promise<boolean> => {
    const value = await getValue(IS_FETCHING_KEY);
    return value === "true";
};

export const setIsFetching = async (value: boolean): Promise<void> => {
    setValue(IS_FETCHING_KEY, String(value));
};

export const saveOrUpdateIssues = async (issues: Issue[]): Promise<void> => {
    const pipeline = redis.pipeline();
    issues.map((issue: Issue) => {
        pipeline.hset(ISSUES_REDIS_KEY, issue.number, JSON.stringify(issue));
    });
  
    await pipeline.exec();
};

export const getAllIssues = async (): Promise<Issue[]> => {
    const result = await redis.hgetall(ISSUES_REDIS_KEY);
    return Object.values(result).map(value => JSON.parse(value));  
};