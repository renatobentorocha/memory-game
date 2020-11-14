import React from 'react';

export type TableContextProps = {
  setData: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

export const TableContext = React.createContext<TableContextProps>({
  setData: () => undefined,
});

const TableContexProvider: React.FC<TableContextProps> = ({
  children,
  setData,
}) => {
  return (
    <TableContext.Provider
      value={{
        setData,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableContexProvider;
