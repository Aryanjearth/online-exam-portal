import React, { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Table, message } from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getAllAttemptsByUser } from '../../../apicalls/reports'

function ReportsPage() {
  const [reportsData, setReportsData] = useState([])
  const dispatch = useDispatch()

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam?.name || "N/A"}</>
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) =>
        <>{new Date(record.createdAt).toLocaleString()}</>
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      render: (text, record) => <>{record.exam?.totalMarks ?? "N/A"}</>
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      render: (text, record) => <>{record.exam?.passingMarks ?? "N/A"}</>
    },
    {
      title: "Obtained Marks",
      dataIndex: "obtainedMarks",
      render: (text, record) => (
        <>{record.result?.correctAnswers?.length ?? "N/A"}</>
      )
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result?.verdict || "N/A"}</>
    }
  ]

  const getData = async () => {
    try {
      dispatch(ShowLoading())
      const response = await getAllAttemptsByUser()
      dispatch(HideLoading())

      if (response.success) {
        setReportsData(response.data)
        message.success(response.message)
        console.log("Fetched Reports:", response.data)
      } else {
        message.error(response.message)
      }
    } catch (error) {
      dispatch(HideLoading())
      message.error(error.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <PageTitle title="Reports" />
      <div className='divider'></div>
      <Table
        columns={columns}
        className="mt-2"
        dataSource={reportsData}
        rowKey={(record) => record._id}
        locale={{ emptyText: 'No reports found' }}
      />
    </div>
  )
}

export default ReportsPage
