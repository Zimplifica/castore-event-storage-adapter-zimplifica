
import { EventDetail, GroupedEvent, OptionalTimestamp } from '@castore/core';

export declare type CustomEventsQueryOptions = {
    minVersion?: number;
    maxVersion?: number;
    limit?: number;
    reverse?: boolean;
    hashed?: boolean; 
};
export declare type EventStoreContext = {
    eventStoreId: string;
};
export declare type PushEventOptions = EventStoreContext & {
    force?: boolean;
};
export declare type ListAggregateIdsOptions = {
    limit?: number;
    pageToken?: string;
    initialEventAfter?: string;
    initialEventBefore?: string;
    reverse?: boolean;
};
export declare type ListAggregateIdsOutput = {
    aggregateIds: {
        aggregateId: string;
        initialEventTimestamp: string;
    }[];
    nextPageToken?: string;
};
export interface CustomEventStorageAdapter {
    getEvents: (aggregateId: string, context: EventStoreContext, options?: CustomEventsQueryOptions) => Promise<{
        events: EventDetail[];
    }>;
    pushEvent: (eventDetail: OptionalTimestamp<EventDetail>, options: PushEventOptions) => Promise<{
        event: EventDetail;
    }>;
    pushEventGroup: (options: {
        force?: boolean;
    }, ...groupedEvents: [GroupedEvent, ...GroupedEvent[]]) => Promise<{
        eventGroup: {
            event: EventDetail;
        }[];
    }>;
    groupEvent: (eventDetail: OptionalTimestamp<EventDetail>) => GroupedEvent;
    listAggregateIds: (context: EventStoreContext, options?: ListAggregateIdsOptions) => Promise<ListAggregateIdsOutput>;
}

