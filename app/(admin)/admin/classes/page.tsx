'use client'
import AdminAddClass from '@/components/admin/AdminAddClass'
import AdminAllClasses from '@/components/admin/AdminAllClasses'
import AdminTabs from '@/components/admin/AdminTabs'

const page = () => {
    return (
        <>
            <AdminTabs
                tabs={[
                    {
                        key: 'all',
                        label: 'All Classes',
                        content: <AdminAllClasses />
                    },
                    {
                        key: 'add',
                        label: 'Add Class',
                        content: <AdminAddClass />
                    }
                ]}
            />
        </>
    )
}

export default page
