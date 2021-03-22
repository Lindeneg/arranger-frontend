import { BaseProps, ChecklistResponse, Functional } from '../../../common/util';

interface ChecklistsProps extends BaseProps {
    checklists: ChecklistResponse[];
}

const Checklists: Functional<ChecklistsProps> = (props) => (
    <div>
        {props.checklists.map((e) => (
            <p>CheckList</p>
        ))}
    </div>
);

export default Checklists;
