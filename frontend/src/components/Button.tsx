import { MdBloodtype } from "react-icons/md";

interface Props {
  children: String;
  color: String;
  onClick: () => void;
}

const Button = ({children, onClick, color } : Props) => {
  return (<div>
    <button className={'btn btn-' + color} onClick={onClick} >
        {children}
    </button>
    <MdBloodtype color='red' size='50'/>
    </div>
  )
}

export default Button