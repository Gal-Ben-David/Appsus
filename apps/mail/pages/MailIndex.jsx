const { useEffect, useState, useRef } = React

const { Link, useSearchParams, useLocation } = ReactRouterDOM

// import { showErrorMsg } from 'services/event-bus.service.js'
import { mailService } from '../services/mail.service.js';
import { MailFilter } from "../cmps/MailFilter.jsx";
import { MailList } from "../cmps/MailList.jsx";
import { MailCompose } from '../cmps/MailCompose.jsx';
import { getTruthyValues } from '../../../services/util.service.js'
import { utilService } from '../../../services/util.service.js'



export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [isMailCompose, setIsMailCompose] = useState(false)
    const [dateCompose, setDateCompose] = useState()
    const [changeReadStatus, setChangeReadStatus] = useState(false)
    const [changeStarredStatus, setChangeStarredStatus] = useState(false)
    const [sortBy, setSortBy] = useState('')

    const [mailToEdit, setMailToEdit] = useState(mailService.getEmptyMail())

    const intervalRef = useRef()

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))

    useEffect(() => {
        setSearchParams(getTruthyValues(filterBy))
        onSort()
        if (!sortBy) loadMails()
    }, [isMailCompose, filterBy, sortBy])

    useEffect(() => {
        document.body.style.backgroundColor = '#F6F8FC';
    }, [])

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => {
                console.log('Problems getting mails:', err)
            })

    }

    function onSetFilterBy(filterBy) {
        setFilterBy(preFilter => ({ ...preFilter, ...filterBy }))
    }

    function openMailCompose() {
        setIsMailCompose(true)
        setDateCompose(new Date())
    }

    function onReadMail(mail) {
        mail.isRead = !mail.isRead
        mailService.save(mail)
        console.log(mail);
        setChangeReadStatus(!changeReadStatus)
    }

    function onRemoveMail(mailId, mail) {
        if (!!mail.removedAt) {
            mailService.remove(mailId)
                .then(() => {
                    setMails(mails => mails.filter(mail => mail.id !== mailId))
                    // showSuccessMsg(`Mail removed successfully!`)
                })
                .catch(err => {
                    console.log('Problems removing mail:', err)
                    // showErrorMsg(`Problems removing mail (${mailId})`)
                })
        } else {
            mail.removedAt = new Date()
            mailService.save(mail)
                .then(() => {
                    setMails(mails => mails.filter(mail => !mail.removedAt))
                    // showSuccessMsg(`Mail removed successfully!`)
                })
        }
    }


    function onSort() {
        if (sortBy === 'title') {
            setMails(mails => mails.sort((mail1, mail2) => mail1.subject.localeCompare(mail2.subject)))
        }
        else if (sortBy === 'date') {
            setMails(mails => mails.sort((mail2, mail1) => new Date(mail1.sentAt) - new Date(mail2.sentAt)))
        }
    }

    function onStar(mail) {
        if (!mail.isStarred) mail.isStarred = true
        else mail.isStarred = !mail.isStarred
        mailService.save(mail)
        setChangeStarredStatus(!changeStarredStatus)
    }

    const toggleMailCompose = isMailCompose ? '' : 'hide'
    if (!mails) return <div className="loader"></div>

    console.log('hi', isMailCompose, toggleMailCompose);
    return (
        <section className="mail-index">
            <MailFilter setSortBy={setSortBy} setMails={setMails} filterBy={filterBy} onSetFilterBy={onSetFilterBy} openMailCompose={openMailCompose} mails={mails} />
            <section>
                <MailList onStar={onStar} onRemoveMail={onRemoveMail} onReadMail={onReadMail} mails={mails} />
            </section>
            <section className={`mail-compose-container ${toggleMailCompose}`}>
                <MailCompose intervalRef={intervalRef} mailToEdit={mailToEdit} setMailToEdit={setMailToEdit} setSortBy={setSortBy} dateCompose={dateCompose} isMailCompose={isMailCompose} setIsMailCompose={setIsMailCompose} mails={mails} />
            </section>
        </section>
    )
}
