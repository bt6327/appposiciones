import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

export function Column({ column, addCard, children }: { column: { id: any, title: any }, addCard: (id: any) => void, children: ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div ref={setNodeRef} className="w-full md:w-80 bg-gray-100 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
      <button onClick={() => addCard(column.id)} className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">Add Card</button>
    </div>
  );
}
