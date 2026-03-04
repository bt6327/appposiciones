
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


export function Card({ card, deleteCard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      {card.content}
      <button onClick={() => deleteCard(card.id)} className="float-right text-red-500">X</button>
    </div>
  );
}
