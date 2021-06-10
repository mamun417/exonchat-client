import { MutationTree } from 'vuex';
import { VisitorsStateInterface } from './state';

import * as _l from 'lodash';

const mutation: MutationTree<VisitorsStateInterface> = {
    updateVisitor(state: VisitorsStateInterface, visitorInfo: any) {
        if (!state.visitors[visitorInfo.ses_id]) {
            state.visitors[visitorInfo.ses_id] = {
                session_id: visitorInfo.ses_id,
                visits: [
                    {
                        url: visitorInfo.url,
                        first_visit_time: visitorInfo.sent_at,
                        last_stay_time: visitorInfo.sent_at,
                        visiting: true, // if new we assume visiting
                    },
                ],
            };
        } else {
            const visitor = state.visitors[visitorInfo.ses_id];

            if (visitor.visits.length === 10) _l.pullAt(visitor.visits, [0]);

            const lastVisit: any = _l.last(visitor.visits);

            if (lastVisit) {
                if (lastVisit.url === visitorInfo.url) {
                    lastVisit.last_stay_time = visitorInfo.sent_at;
                    lastVisit.visiting = visitorInfo.visiting; // why um not using visitorInfo.visiting for other assign dont know
                } else {
                    lastVisit.visiting = false;

                    visitor.visits.push({
                        url: visitorInfo.url,
                        first_visit_time: visitorInfo.sent_at,
                        last_stay_time: visitorInfo.sent_at,
                        visiting: visitorInfo.visiting, // why um not using visitorInfo.visiting for other assign dont know
                    });
                }
            } else {
                visitor.visits.push({
                    url: visitorInfo.url,
                    first_visit_time: visitorInfo.sent_at,
                    last_stay_time: visitorInfo.sent_at,
                    visiting: true, // new so we assume visiting. if not check visitorInfo.visiting
                });
            }
        }
    },
};

export default mutation;
