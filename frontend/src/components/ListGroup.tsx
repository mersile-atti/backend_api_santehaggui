import { Fragment, useState } from "react";


// in typescript to use props, we use interface which have {item: [], heading: string }
interface Props {
    items: string[];
    heading: string;
    onSelectItem: (item: string) => void; // this is a function that takes a string as an argument and returns void
}
function ListGroup({items, heading, onSelectItem}: Props ) {
   
    // Hook
    const [selectedIndex, setSelectedIndex] = useState(-1) 
   
    
    return (
        <Fragment>
            <h1>{heading}</h1>
            {items.length === 0 && <p>No items found</p>}
            <ul className="list-group">
                {items.map((item, index) => 
                <li className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
                key={item}
                onClick={() => {
                    setSelectedIndex(index);
                    onSelectItem(item);
                }}
                >
                    {item}
                    </li>)}
            </ul>
        </Fragment>
    )

}

export default ListGroup;