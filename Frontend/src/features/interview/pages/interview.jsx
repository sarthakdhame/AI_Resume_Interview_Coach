import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Techical questions' },
    { id: 'behavioral', label: 'Behavioral questions' },
    { id: 'roadmap', label: 'Road Map' },
]

const QuestionCard = ({ item, index, prefix }) => {
    const intention = item?.intention || item?.intenstion || 'No intention provided.'

    return (
        <article className='question-card'>
            <div className='question-card__head'>
                <span className='question-card__index'>{prefix}{index + 1}</span>
                <h3>{item?.question || 'Question not available'}</h3>
            </div>
            <p><strong>Intention:</strong> {intention}</p>
            <p><strong>Model answer:</strong> {item?.answer || 'Model answer not available.'}</p>
        </article>
    )
}

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf, error } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (!report) {
        return (
            <main className='loading-screen'>
                <h1>{error || 'Interview report not found.'}</h1>
                <button className='button primary-button' onClick={() => navigate('/')}>Back to Home</button>
            </main>
        )
    }
    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }




    const technicalQuestions = Array.isArray(report?.technicalQuestions) ? report.technicalQuestions : []
    const behavioralQuestions = Array.isArray(report?.behavioralQuestions)
        ? report.behavioralQuestions
        : Array.isArray(report?.behaviouralQuestions)
            ? report.behaviouralQuestions
            : []
    const preparationPlan = Array.isArray(report?.preparationPlan) ? report.preparationPlan : []
    const skillGaps = Array.isArray(report?.skillGaps) ? report.skillGaps : []
    const scoreValue = Math.max(0, Math.min(100, Number(report?.matchScore) || 0))
    const scoreTone = scoreValue >= 60 ? 'score-box--neutral' : 'score-box--danger'

    const renderMainContent = () => {
        if (activeNav === 'technical') {
            return (
                <section className='content-pane'>
                    <header className='content-pane__header'>
                        <h2>Technical questions</h2>
                        <span>{technicalQuestions.length}</span>
                    </header>

                    <div className='content-pane__body'>
                        {technicalQuestions.length === 0 && <p className='empty-state'>No technical questions found.</p>}
                        {technicalQuestions.map((question, index) => (
                            <QuestionCard key={index} item={question} index={index} prefix='T' />
                        ))}
                    </div>
                </section>
            )
        }

        if (activeNav === 'behavioral') {
            return (
                <section className='content-pane'>
                    <header className='content-pane__header'>
                        <h2>Behavioral questions</h2>
                        <span>{behavioralQuestions.length}</span>
                    </header>

                    <div className='content-pane__body'>
                        {behavioralQuestions.length === 0 && <p className='empty-state'>No behavioral questions found.</p>}
                        {behavioralQuestions.map((question, index) => (
                            <QuestionCard key={index} item={question} index={index} prefix='B' />
                        ))}
                    </div>
                </section>
            )
        }

        return (
            <section className='content-pane'>
                <header className='content-pane__header'>
                    <h2>Preparation Road Map</h2>
                    <span>{preparationPlan.length} days</span>
                </header>

                <div className='content-pane__body roadmap-pane'>
                    {preparationPlan.length === 0 && <p className='empty-state'>No preparation plan found.</p>}
                    {preparationPlan.map((day) => (
                        <article className='roadmap-card' key={day.day}>
                            <h3>Day {day.day}: {day.focus}</h3>
                            <ul>
                                {(Array.isArray(day.tasks) ? day.tasks : []).map((task, taskIndex) => (
                                    <li key={taskIndex}>{task}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        )
    }


    return (
        <div className='interview-page'>
            <div className='interview-layout'>
                <nav className='interview-nav'>
                    <div className='interview-nav__content'>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button interview-nav__download'>
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <main className='interview-content'>
                    {renderMainContent()}
                </main>

                <aside className='interview-sidebar'>
                    <div className={`score-box ${scoreTone}`} style={{ '--score': `${scoreValue}%` }}>
                        <p className='score-box__label'>Match Score</p>
                        <p className='score-box__value'>{scoreValue}%</p>
                    </div>

                    <div className='skill-gaps'>
                        <h3>Skill Gaps</h3>
                        <div className='skill-gaps__list'>
                            {skillGaps.map((gap, i) => (
                                <span key={i} className='skill-tag'>
                                    {gap.skill}
                                </span>
                            ))}
                            {skillGaps.length === 0 && <p className='empty-state'>No skill gaps found.</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview