//@flow
import moment from 'moment';

export const formatTime = (date: string): string => moment(date, 'hh:mm:ss').format('h:mma');
