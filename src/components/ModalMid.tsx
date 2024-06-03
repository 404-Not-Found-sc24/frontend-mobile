import '../index.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const ModalMid: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="modal">
            <div className="bpopup popMid">
                {children}
                <button className="popClose" onClick={onClose}></button>
            </div>
        </div>
    );
};

export default ModalMid;