import * as moment from "moment";
import * as React  from "react";

interface IHumanizedTimeProps {
    time: Date;
    className?: string;
}

export class HumanizedTime extends React.Component<IHumanizedTimeProps> {
    public render(): React.ReactNode {
        const currentDate = moment();
        const messageDate = moment(this.props.time);
        const timeAgo = moment.duration(messageDate.diff(currentDate));
        const formattedAgo = timeAgo.humanize();
        return (
            <span className={this.props.className}>{formattedAgo} ago</span>
        );
    }
}

