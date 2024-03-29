import { React, useMemo, useState, useRef } from "react";
import { Button } from "@chakra-ui/react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Icon
} from "@chakra-ui/react";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { MdCheckCircle, MdCancel } from "react-icons/md";

// Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Alert Dialog
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'


import { ModalAddTask } from "./ModalAddTask";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const TasksListTable = (props) => {
  const { columnsData, tableData } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  let successMsg
  const userId = localStorage.getItem("userId")

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const history = useHistory();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex },
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set your initial state here
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // Alert Dialog
  const cancelRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const onAddClick = () => {
    setIsModalOpen(true);
    setSelectedTaskId(null);
  };

  const handleEditClick = (taskId) => {
    setIsModalOpen(true);
    setSelectedTaskId(taskId);
  };

  const handleComplete = async(taskId) => {
    // Handle edit logic here
    console.log("Complete task with ID:", taskId);
    try {
      const response = await axios.patch(`http://localhost:5000/complete-task/${userId}/${taskId}`, {
        isCompleted: true,
      })
      successMsg = response.data.msg
      history.push('/dashboard');
      notify()
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = (taskId) => {
    setIsOpen(true);
    setSelectedTaskId(taskId)
  };

  const confirmDelete = async() => {
    setIsOpen(true);
    try {
      const response = await axios.delete(`http://localhost:5000/task/${userId}/${selectedTaskId}`)
      successMsg = response.data.msg
      history.push('/dashboard');
      notify()
    } catch (error) {
      console.log(error)
    }
  };

  const notify = () => {
    toast.success(successMsg, {
      position: "bottom-left",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Tasks List
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                    
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
        {page.map((row, index) => {
            prepareRow(row);
            return (
            <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                let data = "";

                if (cell.column.Header === "No") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                }

                if (cell.column.Header === "Task Name") {
                    data = (
                    <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                        </Text>
                    </Flex>
                    );
                } else if (cell.column.Header === "DateLine") {
                    data = (
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value ? new Date(cell.value).toLocaleDateString() : ''}
                    </Text>
                    );
                } else if (cell.column.Header === "Priority") {
                    data = (
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                    </Text>
                    );
                } 
                else if (cell.column.Header === "Status") {
                    // Adjust rendering logic for Status
                    const iconProps = {
                      Completed: { icon: MdCheckCircle, color: "green.500" },
                      Incomplete: { icon: MdCancel, color: "red.500" },
                    };
                  
                    const statusKey = cell.value ? "Completed" : "Incomplete";
                    const { icon: IconComponent, color } = iconProps[statusKey] || {};
                  
                    data = (
                      <Flex align='center'>
                        {IconComponent && (
                          <Icon w='24px' h='24px' me='5px' as={IconComponent} color={color} />
                        )}
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value !== undefined ? (cell.value ? "Completed" : "Incomplete") : ''}
                        </Text>
                      </Flex>
                    );
                  }
                  
                else if (cell.column.Header === "Tags") {
                    data = (
                        <Flex align='center'>
                        {cell.value && Array.isArray(cell.value) ? (
                          cell.value.map((tag) => (
                            <Button
                              key={tag.id}
                              colorScheme='teal'
                              variant='outline'
                              fontSize='xs'
                              fontWeight='700'
                              mr='2'
                              mt='2'
                              paddingRight={'12px'}
                              paddingLeft={'12px'}
                              borderRadius='lg'
                              onClick={(key) => {
                                console.log("Click tag :", tag.namaTag);
                              }}
                            >
                              {tag.namaTag}
                            </Button>
                          ))
                        ) : (
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            No Tags
                          </Text>
                        )}
                      </Flex>
                      
                    );
                } else if (cell.column.Header === "Action") {
                    data = (
                    <Flex>
                        <Button onClick={() => handleComplete(row.original.id)}>
                            <CheckOutlinedIcon sx={{ color: '#01B574' }}/>
                        </Button>
                        <Button onClick={() => handleEditClick(row.original.id)}>
                            <EditOutlinedIcon/>
                        </Button>
                        <Button onClick={() => handleDelete(row.original.id)}>
                            <DeleteOutlineOutlinedIcon sx={{ color: '#EE5D50' }}/>
                        </Button>
                    </Flex>
                    );
                }

                return (
                    <Td
                    {...cell.getCellProps()}
                    key={index}
                    fontSize={{ sm: "14px" }}
                    minW={{ sm: "150px", md: "200px", lg: "auto" }}
                    borderColor='transparent'
                    >
                    {data}
                    </Td>
                );
                })}
            </Tr>
            );
        })}
        </Tbody>
      </Table>
      <Button
        variant='darkBrand'
        color='white'
        fontSize='sm'
        fontWeight='500'
        borderRadius='70px'
        px='24px'
        py='5px'
        width='150px'
        marginLeft='20px'
        marginBottom='24px'
        onClick={() => onAddClick()}
        >
        Add Task
      </Button>
      <ModalAddTask
        isOpen={isModalOpen}
        onCloseModal={() => {
          setIsModalOpen(false);
          setSelectedTaskId(null);
        }}
        editTaskId={selectedTaskId}
      />
      <Flex justify='space-between' mt='2'>
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>
        <Text>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </Text>
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>
      </Flex>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Task?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this task?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='red' ml={3} onClick={confirmDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastContainer />
    </Card>
  );
};