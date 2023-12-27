/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid, Button } from "@chakra-ui/react";
import { React, useState, useEffect, useMemo } from "react";
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
  Icon,
  useBreakpointValue
} from "@chakra-ui/react";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import axios from "axios";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { MdCheckCircle, MdCancel } from "react-icons/md";

import PageviewOutlinedIcon from '@mui/icons-material/PageviewOutlined';
import { TasksListTable } from "./components/TasksListTable";

// Data Variables
import {
  columnDataTasks,
  columnDataTags
} from "views/admin/dataTables/variables/columnsData";

const handleEdit = (tagId) => {
    // Handle edit logic here
    console.log("Edit tag with ID:", tagId);
  };

const handleViewDetails = (tagId) => {
    // Handle edit logic here
    console.log("View details tag with ID:", tagId);
  };

  const handleDelete = (tagId) => {
    // Handle delete logic here
    console.log("Delete tag with ID:", tagId);
  };

const TagsListTable = (props) => {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
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
      initialState: { pageIndex: 0, pageSize: 5 }, // Set your initial state here
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const cardWidth = useBreakpointValue({ base: "100%", xl: "60%" });

  return (
    <Card
      direction='column'
      w={cardWidth}
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Tags List
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

                if (cell.column.Header === "Tag Name") {
                    data = (
                    <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                        </Text>
                    </Flex>
                    );
                } else if (cell.column.Header === "Description") {
                    data = (
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                    </Text>
                    );
                } else if (cell.column.Header === "Action") {
                    data = (
                        <Flex>
                            <Button onClick={() => handleViewDetails(row.original.id)}>
                                <PageviewOutlinedIcon sx={{ color: '#01B574' }}/>
                            </Button>
                            <Button onClick={() => handleEdit(row.original.id)}>
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
    </Card>
  );
};

const Dashboard = () => {
    const [tasks, setTasks] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        getAllTasks()
        getAllTags()
    }, [])

    const getAllTasks = async(e) => {
        try {
            const response = await axios.get(`http://localhost:5000/tasks/1`)
            console.log("Tasks : ", response.data.data)
            setTasks(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllTags = async(e) => {
        try {
            const response = await axios.get(`http://localhost:5000/tags/1`)
            console.log("Tags : ", response.data.data)
            setTags(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <TasksListTable
          columnsData={columnDataTasks}
          tableData={tasks}
        />
        <TagsListTable
          columnsData={columnDataTags}
          tableData={tags}
        />
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
